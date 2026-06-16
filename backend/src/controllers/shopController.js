import ShopItem from '../models/ShopItem.js';
import UserPurchase from '../models/UserPurchase.js';
import { spendTokens, refundTokens } from '../utils/tokenHelpers.js';

export const getShopItems = async (req, res) => {
  try {
    const { type, subject, grade } = req.query;
    const filter = { isActive: true };
    if (type) filter.type = type;
    if (subject && subject !== 'all') filter.$or = [{ subject }, { subject: 'all' }];
    if (grade && grade !== 'all') filter.$or = [...(filter.$or || []), { grade }, { grade: 'all' }];

    const items = await ShopItem.find(filter).sort({ sortOrder: 1, price: 1 });

    let ownedIds = new Set();
    if (req.user) {
      const purchases = await UserPurchase.find({ userId: req.user._id }).select('itemId');
      ownedIds = new Set(purchases.map(p => p.itemId.toString()));
    }

    const itemsWithOwnership = items.map(item => ({
      ...item.toObject(),
      owned: ownedIds.has(item._id.toString()),
    }));

    return res.status(200).json({ success: true, data: itemsWithOwnership });
  } catch (err) {
    console.error('Get shop items error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const purchaseItem = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const item = await ShopItem.findById(id);
    if (!item || !item.isActive) {
      return res.status(404).json({ success: false, message: 'Item not found or unavailable' });
    }

    if (item.stock !== -1 && item.stock <= 0) {
      return res.status(400).json({ success: false, message: 'Item is out of stock' });
    }

    const existingPurchase = await UserPurchase.findOne({ userId: user._id, itemId: item._id });
    if (existingPurchase) {
      const nonConsumables = ['flashcard_pack', 'quiz_unlock', 'cosmetic'];
      if (nonConsumables.includes(item.type)) {
        return res.status(400).json({ success: false, message: 'You already own this item' });
      }

      const consumables = ['power_up', 'boost'];
      if (consumables.includes(item.type)) {
        const unusedPurchase = await UserPurchase.findOne({
          userId: user._id,
          itemId: item._id,
          used: false
        });
        if (unusedPurchase) {
          return res.status(400).json({ success: false, message: 'You have an unused item of this type. Use it first.' });
        }
      }
    }

    let spendResult;
    try {
      spendResult = await spendTokens(user._id, item.price, {
        referenceType: 'shop',
        reason: `Purchased: ${item.title}`,
        meta: { itemId: item._id, itemType: item.type },
      });
    } catch (spendErr) {
      if (spendErr.message === 'Insufficient tokens') {
        return res.status(400).json({ success: false, message: 'Insufficient diamonds' });
      }
      if (spendErr.message === 'Account frozen') {
        return res.status(403).json({ success: false, message: 'Account is frozen' });
      }
      throw spendErr;
    }

    try {
      const purchase = await UserPurchase.create({
        userId: user._id,
        itemId: item._id,
        tokensSpent: item.price,
        meta: item.meta,
      });

      if (item.stock !== -1) {
        item.stock -= 1;
        await item.save();
      }

      return res.status(200).json({
        success: true,
        message: `Successfully purchased "${item.title}"`,
        balance: spendResult.balance,
        purchase: { ...purchase.toObject(), item: item.toObject() },
      });
    } catch (createErr) {
      await refundTokens(
        user._id,
        item.price,
        'shop',
        item._id,
        `Refund for failed purchase: ${item.title}`
      ).catch(e => console.error('Refund failed:', e));

      console.error('Purchase record creation failed, tokens refunded:', createErr);
      return res.status(500).json({ success: false, message: 'Purchase failed, tokens refunded' });
    }
  } catch (err) {
    console.error('Purchase item error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getMyPurchases = async (req, res) => {
  try {
    const purchases = await UserPurchase.find({ userId: req.user._id })
      .populate('itemId')
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: purchases });
  } catch (err) {
    console.error('Get purchases error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createShopItem = async (req, res) => {
  try {
    const item = await ShopItem.create(req.body);
    return res.status(201).json({ success: true, data: item });
  } catch (err) {
    console.error('Create shop item error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateShopItem = async (req, res) => {
  try {
    const item = await ShopItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    return res.status(200).json({ success: true, data: item });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteShopItem = async (req, res) => {
  try {
    await ShopItem.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: 'Deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getAdminShopStats = async (req, res) => {
  try {
    const ShopItem = (await import('../models/ShopItem.js')).default;
    const totalItems = await ShopItem.countDocuments();
    const totalPurchases = await UserPurchase.countDocuments();
    const totalRevenueAgg = await UserPurchase.aggregate([{ $group: { _id: null, total: { $sum: '$tokensSpent' } } }]);
    const totalTokensSpent = totalRevenueAgg[0]?.total || 0;
    const topItems = await UserPurchase.aggregate([
      { $group: { _id: '$itemId', count: { $sum: 1 }, revenue: { $sum: '$tokensSpent' } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'shopitems', localField: '_id', foreignField: '_id', as: 'item' } },
      { $unwind: '$item' },
    ]);
    return res.status(200).json({
      success: true,
      data: {
        totalItems,
        totalPurchases,
        totalRevenue: totalTokensSpent,
        totalTokensSpent,
        topItems,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

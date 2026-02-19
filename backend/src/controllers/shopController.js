import ShopItem from '../models/ShopItem.js';
import UserPurchase from '../models/UserPurchase.js';
import TokenTransaction from '../models/TokenTransaction.js';
import User from '../models/User.js';

// GET /api/shop
export const getShopItems = async (req, res) => {
  try {
    const { type, subject, grade } = req.query;
    const filter = { isActive: true };
    if (type) filter.type = type;
    if (subject && subject !== 'all') filter.$or = [{ subject }, { subject: 'all' }];
    if (grade && grade !== 'all') filter.$or = [...(filter.$or || []), { grade }, { grade: 'all' }];

    const items = await ShopItem.find(filter).sort({ sortOrder: 1, price: 1 });

    // Attach "owned" flag if authenticated
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

// POST /api/shop/:id/purchase
export const purchaseItem = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const item = await ShopItem.findById(id);
    if (!item || !item.isActive) {
      return res.status(404).json({ success: false, message: 'Item not found or unavailable' });
    }

    // Check stock
    if (item.stock !== -1 && item.stock <= 0) {
      return res.status(400).json({ success: false, message: 'Item is out of stock' });
    }

    // Check if already owned (for non-consumables)
    const alreadyOwned = await UserPurchase.findOne({ userId: user._id, itemId: item._id });
    if (alreadyOwned && item.type !== 'power_up' && item.type !== 'boost') {
      return res.status(400).json({ success: false, message: 'You already own this item' });
    }

    // Check balance
    if ((user.tokens || 0) < item.price) {
      return res.status(400).json({ success: false, message: 'Insufficient diamonds' });
    }

    // Deduct tokens
    user.tokens = (user.tokens || 0) - item.price;
    await user.save();

    // Create purchase record
    const purchase = await UserPurchase.create({
      userId: user._id,
      itemId: item._id,
      tokensSpent: item.price,
      meta: item.meta,
    });

    // Create token transaction
    await TokenTransaction.create({
      userId: user._id,
      type: 'redeem',
      amount: -item.price,
      reason: `Purchased: ${item.title}`,
      meta: { itemId: item._id, purchaseId: purchase._id },
    });

    // Decrement stock if limited
    if (item.stock !== -1) {
      item.stock -= 1;
      await item.save();
    }

    return res.status(200).json({
      success: true,
      message: `Successfully purchased "${item.title}"`,
      balance: user.tokens,
      purchase: { ...purchase.toObject(), item: item.toObject() },
    });
  } catch (err) {
    console.error('Purchase item error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/shop/my-purchases
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

// POST /api/shop (admin: create item)
export const createShopItem = async (req, res) => {
  try {
    const item = await ShopItem.create(req.body);
    return res.status(201).json({ success: true, data: item });
  } catch (err) {
    console.error('Create shop item error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PUT /api/shop/:id (admin)
export const updateShopItem = async (req, res) => {
  try {
    const item = await ShopItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    return res.status(200).json({ success: true, data: item });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// DELETE /api/shop/:id (admin)
export const deleteShopItem = async (req, res) => {
  try {
    await ShopItem.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: 'Deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/shop/admin/stats (admin)
export const getAdminShopStats = async (req, res) => {
  try {
    const totalPurchases = await UserPurchase.countDocuments();
    const totalRevenue = await UserPurchase.aggregate([{ $group: { _id: null, total: { $sum: '$tokensSpent' } } }]);
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
        totalPurchases,
        totalRevenue: totalRevenue[0]?.total || 0,
        topItems,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

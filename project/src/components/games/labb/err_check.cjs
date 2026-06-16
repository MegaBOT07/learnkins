try {
  require('./patch.cjs');
} catch (e) {
  console.log(e.stack);
}

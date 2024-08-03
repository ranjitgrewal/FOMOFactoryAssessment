// models/Data.ts
import mongoose from 'mongoose';

const StockSchema = new mongoose.Schema({
  data: { type: Object, required: true },
});

export default mongoose.models.Stock || mongoose.model('Stock', StockSchema);

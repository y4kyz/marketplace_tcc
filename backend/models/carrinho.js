import mongoose from "mongoose";

const carrinhoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  itens: [
    {
      produto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Produto"
      },
      quantidade: {
        type: Number,
        default: 1
      }
    }
  ]
});

export default mongoose.model("Carrinho", carrinhoSchema);
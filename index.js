const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

// 🔹 Aceita JSON (Postman, etc)
app.use(express.json());

// 🔹 Aceita form-data / x-www-form-urlencoded (Sketchware)
app.use(express.urlencoded({ extended: true }));

app.use(cors());

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

app.post("/pix", async (req, res) => {
  try {
    // 🔹 Agora funciona no Sketchware
    const valor = Number(req.body.valor);
    const email = req.body.email;

    // 🔒 Validação básica
    if (!valor || !email) {
      return res.status(400).json({ erro: "Dados inválidos" });
    }

    const response = await axios.post(
      "https://api.mercadopago.com/v1/payments",
      {
        transaction_amount: valor,
        description: "Plano VIP",
        payment_method_id: "pix",
        payer: { email: email }
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      id: response.data.id,
      status: response.data.status,
      qr_code:
        response.data.point_of_interaction.transaction_data.qr_code,
      qr_code_base64:
        response.data.point_of_interaction.transaction_data.qr_code_base64
    });

  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      erro: "Erro ao gerar Pix"
    });
  }
});

// 🔹 Rota teste (opcional)
app.get("/", (req, res) => {
  res.send("API Pix online");
});

app.listen(3000, () => {
  console.log("API Pix rodando");
});

const express = require("express");
const mongoose = require("mongoose");
const port = 3000
 
const app = express();
app.use(express.json());

mongoose

  .connect("mongodb://localhost:27017/Biblioteca")// pasta "Biblioteca" criada no mongodb se caso não existir
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((erro) => console.error("Erro ao conectar ao MongoDB", erro));

const esquemaEstudante = new mongoose.Schema({
  nome: { type: String, required: true },
  matricula: { type: String, required: true },
  curso: { type: String, required: true },
  ano: { type: String, required: true },
});

const Estudante = mongoose.model("Estudante", esquemaEstudante);

async function criarEstudante(nome, matricula, curso, ano) {
  try {
    const novoEstudante = new Estudante({ nome, matricula, curso, ano });
    return await novoEstudante.save();
  } catch (erro) {
    console.error("Erro ao criar estudante", erro);
    throw erro;
  }
}

app.post("/estudantes", async (req, res) => {
  try {
    const { nome, matricula, curso, ano } = req.body;
    const novoEstudante = await criarEstudante(nome, matricula, curso, ano );
    res.status(201).json({
      mensagem: "Estudante criado com sucesso",
      estudante: novoEstudante,
    });
  } catch (erro) {
    res
      .status(500)
      .json({ mensagem: "Erro ao criar estudante", erro: erro.message });
  }
});

async function listarEstudantes() {
  try {
    return await Estudante.find()
   
  } catch (erro) {
    res.status(500).json({ mensagem: "Estudantes não encontrados" });
    throw erro
  }
}

app.get("/estudantes", async (req, res) => {
  try {
    const Estudantes = await listarEstudantes();
    res.status(200).json({mensagem:"Estudantes encontrados:", Estudantes}); 
  } catch (erro) {
    res.status(500).json({ mensagem: "Erro ao listar estudantes", erro: erro.mensagem });
  }
});

async function atualizarEstudante(id, nome, matricula, curso, ano) {
  try {
    const EstudanteAtualizado = await Estudante.findByIdAndUpdate(
      id,
      { nome, matricula, curso, ano },
      { new: true, runValidators: true }
    );
    return EstudanteAtualizado;
  } catch (erro) {
    console.error("Erro ao atualizar Estudante:", erro);
    throw erro;
  }
}

app.put("/estudantes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, matricula, curso, ano} = req.body;
    const estudanteAtualizado = await atualizarEstudante(
        id,
        nome, 
        matricula,
        curso,
        ano
    );
    if (estudanteAtualizado) {
      res.status(200).json({
        mensagem: "Estudante atualizado com sucesso",
        estudante: estudanteAtualizado,
      });
    } else {
      res.status(404).json({ mensagem: "estudante não encontrado" });
    }
  } catch (erro) {
    res
      .status(500)
      .json({ mensagem: "Erro ao atualizar estudante", erro: erro.message });
  }
});

async function deletarEstudante(id) {
    try {
      const estudantesDeletado = await Estudante.findByIdAndDelete(id);
      return estudantesDeletado;
    } catch (erro) {
      console.error("Erro ao deletar estudantes:", erro);
      throw erro;
    }
}

  app.delete("/estudantes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const estudanteDeletado = await deletarEstudante(id);
      if (estudanteDeletado) {
        res
          .status(200)
          .json({ mensagem: "Estudante deletado com sucesso", estudante: estudanteDeletado });
      } else {
        res.status(404).json({ mensagem: "Estudante não encontrado" });
      }
    } catch (erro) {
      res
        .status(500)
        .json({ mensagem: "Erro ao deletar estudante", erro: erro.message });
    }
  });
  
////////////////////////////////////////LIVROS///////////////////////////////////////////////

const esquemaLivro = new mongoose.Schema({
  titulo: { type: String, required: true },
  autor: { type: String, required: true },
  ano: { type: Number, required: true },
  genero: { type: String, required: true },
});

const Livro = mongoose.model("Livro", esquemaLivro);

async function criarLivro(titulo, autor, ano, genero) {
  try {
    const novoLivro = new Livro({ titulo, autor, ano, genero });
    return await novoLivro.save();
  } catch (erro) {
    console.error("Erro ao criar livro:", erro);
    throw erro;
  }
}

app.post("/livros", async (req, res) => {
  try {
    const { titulo, autor, ano, genero } = req.body;
    const novoLivro = await criarLivro(titulo, autor, ano, genero);
    res
      .status(201)
      .json({ mensagem: "Livro criado com sucesso", livro: novoLivro });
  } catch (erro) {
    res
      .status(500)
      .json({ mensagem: "Erro ao criar livro", erro: erro.message });
  }
});

async function obterLivros() {
  try {
    return await Livro.find();
  } catch (erro) {
    console.error("Erro ao obter livros:", erro);
    throw erro;
  }
}

app.get("/livros", async (req, res) => {
  try {
    const livros = await obterLivros();
    res.status(200).json(livros);
  } catch (erro) {
    res
      .status(500)
      .json({ mensagem: "Erro ao obter livros", erro: erro.message });
  }
});

async function atualizarLivro(id, titulo, autor, ano, genero) {
  try {
    const livroAtualizado = await Livro.findByIdAndUpdate(
      id,
      { titulo, autor, ano, genero },
      { new: true, runValidators: true }
    );
    return livroAtualizado;
  } catch (erro) {
    console.error("Erro ao atualizar livro:", erro);
    throw erro;
  }
}

app.put("/livros/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, autor, ano, genero } = req.body;
    const livroAtualizado = await atualizarLivro(
      id,
      titulo,
      autor,
      ano,
      genero
    );
    if (livroAtualizado) {
      res
        .status(200)
        .json({
          mensagem: "Livro atualizado com sucesso",
          livro: livroAtualizado,
        });
    } else {
      res.status(404).json({ mensagem: "Livro não encontrado" });
    }
  } catch (erro) {
    res
      .status(500)
      .json({ mensagem: "Erro ao atualizar livro", erro: erro.message });
  }
});

async function deletarLivro(id) {
  try {
    const livroDeletado = await Livro.findByIdAndDelete(id);
    return livroDeletado;
  } catch (erro) {
    console.error("Erro ao deletar livro:", erro);
    throw erro;
  }
}

app.delete("/livros/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const livroDeletado = await deletarLivro(id);
    if (livroDeletado) {
      res
        .status(200)
        .json({ mensagem: "Livro deletado com sucesso", livro: livroDeletado });
    } else {
      res.status(404).json({ mensagem: "Livro não encontrado" });
    }
  } catch (erro) {
    res
      .status(500)
      .json({ mensagem: "Erro ao deletar livro", erro: erro.message });
  }
});

const esquemaAluguel = new mongoose.Schema({
  idLivro: { type: Number, required: true },
  idEstudante: { type: Number, required: true },
  dataAluguel: { type: Number, required: true },
  dataDevolucao: { type: Number, required: true }
});

const Aluguel = mongoose.model("Aluguel", esquemaAluguel);


///////////////////////////////////////////////////////////////////////////////////////////
                                  //CRIAR ALUGUEL//
async function criarAluguel (idLivro, idEstudante, dataAluguel, dataDevolucao) {
  try {
    const novoAluguel = new Aluguel({ idLivro, idEstudante, dataAluguel, dataDevolucao });
    return await novoAluguel.save();
  } catch (erro) {
    console.error("Erro ao criar aluguel:", erro);
    throw erro;
  }
}
app.post("/aluguel", async (req, res) => {
  try {
    const { idLivro, idEstudante, dataAluguel, dataDevolucao } = req.body;
    const novoAluguel = await criarAluguel(idLivro, idEstudante, dataAluguel, dataDevolucao);
    res
      .status(201)
      .json({ mensagem: "Aluguel criado com sucesso", aluguel: novoAluguel });
  } catch (erro) {
    res
      .status(500)
      .json({ mensagem: "Erro ao criar Aluguel", erro: erro.message });
  }
});


////////////////////////////////////////////////////////////////////////////////////////////
                                //LISTAR LIVROS//
async function obterAluguel() {
  try {
    return await Aluguel.find();
  } catch (erro) {
    console.error("Erro ao obter aluguel: ", erro);
    throw erro;
  }
}
app.get("/aluguel", async (req, res) => {
  try {
    const aluguel = await obterAluguel();
    res.status(200).json(aluguel);
  } catch (erro) {
    res
      .status(500)
      .json({ mensagem: "Erro ao obter alugueis", erro: erro.message });
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////
                                  //ATUALIZAR LIVRO//
async function atualizarAluguel( id, idLivro, idEstudante, dataAluguel, dataDevolucao ) {
  try {
    const aluguelAtualizado = await Aluguel.findByIdAndUpdate(
      id,
      { idLivro, idEstudante, dataAluguel, dataDevolucao },
      { new: true, runValidators: true }
    );
    return aluguelAtualizado;
  } catch (erro) {
    console.error("Erro ao atualizar aluguel:", erro);
    throw erro;
  }
}

app.put("/aluguel/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { idLivro, idEstudante, dataAluguel, dataDevolucao } = req.body;
    const aluguelAtualizado = await atualizarAluguel(
      id,
      idLivro,
      idEstudante,
      dataAluguel,
      dataDevolucao
    );
    if (aluguelAtualizado) {
      res
        .status(200)
        .json({
          mensagem: "Aluguel atualizado com sucesso",
          aluguel: aluguelAtualizado,
        });
    } else {
      res.status(404).json({ mensagem: "Aluguel não encontrado" });
    }
  } catch (erro) {
    res
      .status(500)
      .json({ mensagem: "Erro ao atualizar aluguel", erro: erro.message });
  }
});


////////////////////////////////////////////////////////////////////////////////////////////////
                                        //DELETAR LIVRO//
async function deletarAluguel(id) {
  try {
    const aluguelDeletado = await Aluguel.findByIdAndDelete(id);
    return aluguelDeletado;
  } catch (erro) {
    console.error("Erro ao deletar aluguel:", erro);
    throw erro;
  }
}

/////////////////////ALUGUEL/////////////////////////////// 

app.delete("/aluguel/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const aluguelDeletado = await deletarAluguel(id);
    if (aluguelDeletado) {
      res
        .status(200)
        .json({ mensagem: "Aluguel deletado com sucesso", aluguel: aluguelDeletado });
    } else {
      res.status(404).json({ mensagem: "Aluguel não encontrado" });
    }
  } catch (erro) {
    res
      .status(500)
      .json({ mensagem: "Erro ao deletar aluguel", erro: erro.message });
  }
});

  app.listen(port, () => {
    console.log(`Servidor rodando na porta: http://localhost:${port}`);
  });
  
  
  
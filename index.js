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
      const novoLivro = await criarAluguel(idLivro, idEstudante, dataAluguel, dataDevolucao);
      res
        .status(201)
        .json({ mensagem: "Livro criado com sucesso", livro: novoLivro });
    } catch (erro) {
      res
        .status(500)
        .json({ mensagem: "Erro ao criar livro", erro: erro.message });
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
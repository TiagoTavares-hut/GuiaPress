const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify");

router.get("/admin/categories/new",(req, res) => {
    res.render("admin/categories/new");
});

router.post("/categories/save", (req, res) => {
    const title = req.body.title;
    console.log("Titulo recebido:", title);


    if(title != undefined && title.trim() !== "") {
        
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(category => {
            console.log("Categoria salva:", category);
            res.redirect("/admin/categories");
        }).catch(err => {
            console.error("Erro ao salva:", err);
            res.redirect("/admin/categories/new");
        });
    }else{
        res.redirect("/admin/categories/new");
    }
});

router.get("/admin/categories",  (req, res) => {
    Category.findAll().then(categories => {
        console.log("Categorias encontradas:", categories);
        res.render("admin/categories/index", {categories: categories});
    }).catch(err => {
        console.error("Erro ao buscar categorias:", err);
        res.redirect("/");
    });
});

router.post("/categories/delete", (req, res) => {
    const id = req.body.id;

    if(id != undefined && !isNaN(id)) {
            Category.destroy({
                where: { id: id }
            }).then(() => {
                console.log("Categoria deletada, ID:", id)
                res.redirect("/admin/categories");
            }).catch(err => {
                console.error("Erro ao deletar categoria:", err);
                res.redirect("/admin/categories");
            });
        } else {// NÃO FOR UM NÚMERO
            res.redirect("/admin/categories");
        }
});

// Rota para mostrar o formulário de edição
router.get("/admin/categories/edit/:id", (req, res) => {
    const id = req.params.id;

    if (isNaN(id)) {
        res.redirect("/admin/categories");
    }

    Category.findByPk(id).then(category => {
        if (category != undefined) {
            res.render("admin/categories/edit", { category: category });
        } else {
            res.redirect("/admin/categories");
        }
    }).catch(erro => {
        res.redirect("/admin/categories");
    });
});

// Rota para atualizar no banco
router.post("/categories/update", (req, res) => {
    const id = req.body.id;
    const title = req.body.title;

    Category.update(
        { title: title, slug: slugify(title) },
        { where: { id: id } }
    ).then(() => {
        res.redirect("/admin/categories");
    }).catch((err) => {
        console.error("Erro ao atualizar categoria:", err);
        res.redirect("/admin/categories");
    });
});
module.exports = router;
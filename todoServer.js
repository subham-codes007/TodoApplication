const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");
const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());

/* problem with this local storage system is that
when ever we restart the process the previous work will be gone
that's why we will store the data in file specifically in json file
*/


function findIndex(arr, id) {
    let result;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === id) {
            result = i;
            return result;
        }
    }
}

function removeAtIndex(arr, index) {
    let newTodos = [];
    for (let i = 0; i < arr.length; i++) {
        if (i !== index) {
            newTodos.push(arr[i]);
        }
    }
    return newTodos;
}


// Basic Simple stuff -----------------

//let todos = [];
// app.get('/todos', (req, res) => {
//     res.status(201).send(todos);
// });

// app.get('/todos/:id', (req, res) => {
//     let todoIndex = findIndex(todos, parseInt(req.params.id));
//     if (todoIndex === -1) {
//         res.status(404).send("Data not found");
//     }
//     else {
//         res.status(201).json(todos[todoIndex]);
//     }
// });


// app.post("/todos", (req, res) => {
//     let id = Math.floor(Math.random() * 1000);
//     let newTodo = {
//         id: id,
//         title: req.body.title,
//         description: req.body.description
//     }
//     todos.push(newTodo);
//     res.status(200).json(newTodo)
// });

// app.put('/todos/:id', (req, res) => {
//     let todoIndex = findIndex(todos, parseInt(req.params.id));
//     if (todoIndex === -1) {
//         res.status(404).send("Data not found!");
//     }
//     else {
//         todos[todoIndex].title = req.body.title;
//         todos[todoIndex].description = req.body.description;
//         res.status(200).json(todos[todoIndex]);
//     }
// });


// app.delete('/todos/:id', (req, res) => {
//     let todoIndex = findIndex(todos, parseInt(req.params.id));
//     if (todoIndex === -1) {
//         res.status(404).send(`Data not found`);
//     }
//     else {
//         let newTodos = [];
//         newTodos = removeAtIndex(todos, todoIndex);
//         res.status(200).json(newTodos);
//     }
// });

//Now we store all the data we have in a json file
// and accordingly all the functionalities change

app.get('/todos', (req, res) => {
    fs.readFile("todos.json", "utf-8", (err, data) => {
        //if (err) throw err;
        let todos = [JSON.parse(data)];
        res.status(200).json(todos);
    });
});

app.get('/todos/:id', (req, res) => {
    let todos = [];
    fs.readFile("todos.json", "utf-8", (err, data) => {
        if (err) throw err;
        todos = [JSON.parse(data)];
        let todoIndex = findIndex(todos, req.params.id);
        if (todoIndex === -1) {
            res.status(404).send();
        }
        res.status(200).json(todos[todoIndex]);
    });
});

app.post('/todos', (req, res) => {
    const newTodo = {
        id: Math.floor(Math.random() * 1000000), // unique random id
        title: req.body.title,
        description: req.body.description
    };
    fs.readFile("todos.json", "utf8", (err, data) => {
        if (err) throw err;
        let todos = [];
        todos = [JSON.parse(data)];
        todos.push(newTodo);
        //console.log(todos);
        fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
            if (err) throw err;
            res.status(201).json(newTodo);
        });
    });
});


app.put('/todos/:id', (req, res) => {
    fs.readFile("todos.json", "utf-8", (err, data) => {
        if (err) throw err;
        let todos = [];
        todos = [JSON.parse(data)];
        let todoIndex = findIndex(todos, req.params.id);
        if (todoIndex === -1) {
            res.status(404).send();
        }
        todos[todoIndex].title = req.body.title;
        todos[todoIndex].description = req.body.description;
        fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
            if (err) throw err;
        });
        res.status(202).send(todos[todoIndex]);
    });
});

app.delete('/todos/:id', (req, res) => {
    fs.readFile("todos.json", "utf-8", (err, data) => {
        if (err) throw err;
        let todos = [JSON.parse(data)];
        let todoIndex = findIndex(todos, parseInt(req.params.id));
        //console.log(req.params.id);
        //console.log(todoIndex);
        //console.log(todos);
        if (todoIndex === -1) {
            res.status(404).send();
        }
        let newTodos = removeAtIndex(todos, todoIndex);

        fs.writeFile("todos.json", JSON.stringify(newTodos), (err) => {
            if (err) throw err;
            res.status(200).json("hello!");
        });
    });
});

//for any other route requests
app.use((req, res, next) => {
    res.status(404).send();
});

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
})
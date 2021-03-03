const TodoController = require("../../controllers/todo.controller");
const TodoModel = require("../../model/todo.model");
const httpMocks = require("node-mocks-http");
const newTodo = require("../mock-data/new-todo.json");
const allTodos =require("../mock-data/all-todos.json");
// TodoModel.create = jest.fn();
// TodoModel.find = jest.fn();
// TodoModel.findById = jest.fn();
// TodoModel.findByIdAndUpdate= jest.fn();
// TodoModel.findByIdAndDelete = jest.fn();

jest.mock('../../model/todo.model');

let req, res, next;
const todoId="603e3228dfa1a9539450cae1";
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('TodoController.deleteTodo',()=>{

  it("should have a deleteTodo function", () => {
    expect(typeof TodoController.deleteTodo).toBe("function");
  });
  it("should call findByIdAndDelete", async () => {
    req.params.todoId = todoId;
    await TodoController.deleteTodo(req, res, next);
    expect(TodoModel.findByIdAndDelete).toBeCalledWith(todoId);
  });
  it("should return 200 OK and deleted todomodel", async () => {
    TodoModel.findByIdAndDelete.mockReturnValue(newTodo);
    await TodoController.deleteTodo(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newTodo);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should handle errors", async () => {
    const errorMessage = { message: "Error deleting" };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
    await TodoController.deleteTodo(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
  it("should handle 404", async () => {
    TodoModel.findByIdAndDelete.mockReturnValue(null);
    await TodoController.deleteTodo(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });

});

describe('TodoController.updateTodo',()=>{
  it("Should have a updateTodo function",async()=>{
    expect(typeof TodoController.updateTodo).toBe("function");
  });
  it("should update with TodoModel.findByIdAndUpdate",async()=>{
    req.params.todoId=todoId;
    req.body = newTodo;
    await TodoController.updateTodo(req, res, next);
    
    expect(TodoModel.findByIdAndUpdate).toHaveBeenCalledWith(todoId,newTodo,{
      new:true,
      useFindAndModify:false
    });
  });

  it("Should return a response with json data and http code 200",async ()=>{
    req.params.todoId=todoId;
    req.body = newTodo;
    TodoModel.findByIdAndUpdate.mockReturnValue(newTodo);
    await TodoController.updateTodo(req,res,next);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newTodo)
  });
  it("Should to error handling",async()=>{
    const errorMessage={message:"error finding todoModel"};
    const rejectedPromise=Promise.reject(errorMessage);
    TodoModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
    await TodoController.updateTodo(req,res,next);
    expect(next).toHaveBeenCalledWith(errorMessage)

  });
  it("Should handle 404",async()=>{
    TodoModel.findByIdAndUpdate.mockReturnValue(null);
    await TodoController.updateTodo(req,res,next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  })
});
describe('TodoController.getTodoById',()=>{
  it("Should have a getTodoById",()=>{
      expect(typeof TodoController.getTodoById).toBe("function")
  });
  it("Should call TodoModel.findById with route parameters",async()=>{
      req.params.todoId=todoId;
      await TodoController.getTodoById(req,res,next);
      expect(TodoModel.findById).toBeCalledWith(`${todoId}`)
  });
  it("Should return json body and response code 200",async()=>{
    TodoModel.findById.mockReturnValue(newTodo);
    await TodoController.getTodoById(req,res,next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newTodo);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("Should to error handling",async()=>{
    const errorMessage={message:"error finding todoModel"};
    const rejectedPromise=Promise.reject(errorMessage);
    TodoModel.findById.mockReturnValue(rejectedPromise);
    await TodoController.getTodoById(req,res,next);
    expect(next).toHaveBeenCalledWith(errorMessage)

  });
 
})
describe("TodoController.getTodos",()=>{

  //getTodos
  it("Should have a getTodos function",()=>{
    expect(typeof TodoController.getTodos).toBe("function");
  });
  it("Should call TodoModel.find({})",async ()=>{
    await TodoController.getTodos(req,res,next);
    expect(TodoModel.find).toHaveBeenCalledWith({});
  });
  it("Should return response with status 200 and all todos",async()=>{
    TodoModel.find.mockReturnValue(allTodos);
    await TodoController.getTodos(req,res,next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(allTodos);
  });
  it("Should handle errors in getTodos",async ()=>{

    
    const errorMessage={message:"Error finding"};
    const rejectedPromise=Promise.reject(errorMessage);
    TodoModel.find.mockReturnValue(rejectedPromise);
    await TodoController.getTodos(req,res,next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
  it("Should return 404 when item doesn't exist",async()=>{
    TodoModel.findById.mockReturnValue(null);
    await TodoController.getTodoById(req,res,next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("TodoController.createTodo", () => {
  beforeEach(() => {
    req.body = newTodo;
  });

  it("should have a createTodo function", async () => {
    expect(typeof TodoController.createTodo).toBe("function");
  });
  it("should call TodoModel.create", async() => {
    await TodoController.createTodo(req, res, next);
    expect(TodoModel.create).toBeCalledWith(newTodo);
  });
  it("should return 201 response code", async () => {
    await TodoController.createTodo(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should return json body in response", async () => {
     TodoModel.create.mockReturnValue(newTodo);
     await TodoController.createTodo(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });

  test('Should handle errors',async ()=>{
    const errorMessage={message:'Done property missing'};
    const rejectedPromise=Promise.reject(errorMessage);
    await TodoModel.create.mockReturnValue(rejectedPromise);
    await TodoController.createTodo(req, res, next);
    expect(next).toBeCalledWith(errorMessage)
  });
 
});
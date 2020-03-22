import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { TodoModule } from '@todo/todo.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { configuration } from '../../src/config/config';
import { UserEntity } from '@user/entities/user.entity';
import { ValidationPipe } from '@nestjs/common';
import { TodoEntity } from '@todo/entities/todo.entity';

describe('TodoController (e2e)', () => {
  let app;
  let module;
  let token;
  let owner;
  let todos;
  const todoProperties = [
    'createdOn',
    'description',
    'id',
    'name',
    'updatedOn',
  ];
  const usersData = [
    { email: 'email@o2.pl', password: 'password' },
    { email: 'email1@o2.pl', password: 'password' },
  ];
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TodoModule,
        TypeOrmModule.forRoot(configuration.databases.postgres),
      ],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  beforeAll(async done => {
    const userRepository = module.get(getRepositoryToken(UserEntity));
    const userEntity1 = await userRepository.create(usersData[0]);
    await userRepository.save(userEntity1);
    const userEntity2 = await userRepository.create(usersData[1]);
    await userRepository.save(userEntity2);
    request(app.getHttpServer())
      .post('/auth/login')
      .send(usersData[0])
      .set('Accept', 'application/json')
      .end((err, res) => {
        token = 'bearer ' + res.body.token;
        done();
      });
  });

  beforeAll(async () => {
    const userRepository = module.get(getRepositoryToken(UserEntity));
    const todoRepository = module.get(getRepositoryToken(TodoEntity));
    owner = await userRepository.findOne({ email: usersData[0].email });
    const anotherOwner = await userRepository.findOne({
      email: usersData[1].email,
    });
    const todosData = [
      { name: 'todo', description: 'description', owner },
      { name: 'todo1', description: 'description', owner: anotherOwner },
    ];
    const todoEntity1 = todoRepository.create(todosData[0]);
    await todoRepository.save(todoEntity1);
    const todoEntity2 = todoRepository.create(todosData[1]);
    await todoRepository.save(todoEntity2);
    todos = await todoRepository.find();
  });

  describe('create()', () => {
    it('should throw unauthorized exception for anon user', () => {
      return request(app.getHttpServer())
        .post('/todo')
        .expect(401);
    });

    it('should return created todo', done => {
      const todo = { name: 'todo2' };
      request(app.getHttpServer())
        .post('/todo')
        .send(todo)
        .set('Authorization', token)
        .expect(200)
        .end((err, res) => {
          expect(res.body.name).toEqual(todo.name);
          done();
        });
    });
  });

  describe('findAll()', () => {
    it('should throw unauthorized exception for anon user', () => {
      return request(app.getHttpServer())
        .get('/todo')
        .expect(401);
    });

    it('should return all owner todos', done => {
      request(app.getHttpServer())
        .get('/todo')
        .set('Authorization', token)
        .expect(200)
        .end((err, res) => {
          expect(res.body.length).toEqual(2);
          expect(Object.keys(res.body[0]).sort()).toEqual(todoProperties);
          done();
        });
    });
  });

  describe('findById()', () => {
    it('should throw unauthorized exception for anon user', () => {
      return request(app.getHttpServer())
        .get('/todo/1')
        .expect(401);
    });

    it('should return todo if owner', done => {
      request(app.getHttpServer())
        .get(`/todo/${todos[0].id}`)
        .set('Authorization', token)
        .expect(200)
        .end((err, res) => {
          expect(res.body.id).toEqual(todos[0].id);
          expect(Object.keys(res.body).sort()).toEqual(todoProperties);
          done();
        });
    });

    it('should throw not found exception if not owner', () => {
      request(app.getHttpServer())
        .get(`/todo/${todos[1].id}`)
        .set('Authorization', token)
        .expect(404);
    });
  });

  describe('update()', () => {
    it('should throw unauthorized exception for anon user', () => {
      return request(app.getHttpServer())
        .put('/todo/1')
        .expect(401);
    });

    it('should return updated todo if owner', done => {
      const newTodo = { name: 'newTodo', description: 'General kenobi' };
      request(app.getHttpServer())
        .put(`/todo/${todos[0].id}`)
        .send(newTodo)
        .set('Authorization', token)
        .expect(200)
        .end((err, res) => {
          const { name, description } = res.body;
          expect({ name, description }).toEqual(newTodo);
          expect(Object.keys(res.body).sort()).toEqual(todoProperties);
          done();
        });
    });

    it('should throw not found exception if not owner', () => {
      request(app.getHttpServer())
        .put(`/todo/${todos[1].id}`)
        .set('Authorization', token)
        .expect(404);
    });
  });

  describe('delete()', () => {
    it('should throw unauthorized exception for anon user', () => {
      return request(app.getHttpServer())
        .delete('/todo/1')
        .expect(401);
    });

    it('should return 1 and delete record if owner', done => {
      request(app.getHttpServer())
        .delete(`/todo/${todos[0].id}`)
        .set('Authorization', token)
        .expect(200)
        .end((err, res) => {
          expect(res.body.affected).toEqual(1);
          request(app.getHttpServer())
            .get(`/todo/${todos[0].id}`)
            .set('Authorization', token)
            .expect(404)
            .end(done);
        });
    });

    it('should return 0 if not owner', done => {
      request(app.getHttpServer())
        .delete(`/todo/${todos[1].id}`)
        .set('Authorization', token)
        .expect(200)
        .end((err, res) => {
          expect(res.body.affected).toEqual(0);
          done();
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });

  afterAll(async () => {
    const userRepository = module.get(getRepositoryToken(UserEntity));
    const todoRepository = module.get(getRepositoryToken(TodoEntity));
    await todoRepository.delete({});
    await userRepository.delete({});
  });
});

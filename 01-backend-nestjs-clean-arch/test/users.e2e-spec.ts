import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { ValidationFilter } from '../src/common/errors/validation-exception.filter';
import { GlobalExceptionFilter } from '../src/common/errors/global-exception.filter';

/**
 * End-to-end tests for Users API
 *
 * Tests the complete HTTP request/response cycle.
 * Verifies API contracts, error handling, and integration between layers.
 */
describe('Users (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Add validation pipe explicitly for tests
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    
    // Add filters for proper error formatting
    app.useGlobalFilters(new ValidationFilter(), new GlobalExceptionFilter());
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /users', () => {
    it('should create a user successfully', () => {
      const createUserDto = {
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.email).toBe(createUserDto.email);
          expect(res.body.firstName).toBe(createUserDto.firstName);
          expect(res.body.lastName).toBe(createUserDto.lastName);
          expect(res.body).toHaveProperty('createdAt');
          expect(res.body).toHaveProperty('updatedAt');
        });
    });

    it('should return 400 for invalid email', () => {
      const invalidUserDto = {
        email: 'invalid-email',
        firstName: 'John',
        lastName: 'Doe',
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(invalidUserDto)
        .expect(400)
        .expect((res) => {
          expect(res.body.code).toBe('VALIDATION_ERROR');
          expect(res.body.message).toContain('valid email');
        });
    });

    it('should return 400 for missing required fields', () => {
      const incompleteUserDto = {
        email: 'john.doe@example.com',
        // Missing firstName and lastName
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(incompleteUserDto)
        .expect(400)
        .expect((res) => {
          expect(res.body.code).toBe('VALIDATION_ERROR');
          expect(res.body.errors).toContain('First name is required');
          expect(res.body.errors).toContain('Last name is required');
        });
    });

    it('should return 400 for empty string fields', () => {
      const emptyFieldsDto = {
        email: '',
        firstName: '',
        lastName: '',
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(emptyFieldsDto)
        .expect(400)
        .expect((res) => {
          expect(res.body.code).toBe('VALIDATION_ERROR');
        });
    });
  });

  describe('GET /users', () => {

    it('should return all users', async () => {
      // Create a test user first
      const createUserDto = {
        email: 'test.user@example.com',
        firstName: 'Test',
        lastName: 'User',
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('page');
          expect(res.body).toHaveProperty('limit');
          expect(res.body).toHaveProperty('totalPages');
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body.data.length).toBeGreaterThan(0);
        });
    });

    it('should support pagination', async () => {
      // Create test users first
      for (let i = 0; i < 3; i++) {
        await request(app.getHttpServer())
          .post('/users')
          .send({
            email: `user${i}@example.com`,
            firstName: `User${i}`,
            lastName: 'Test',
          })
          .expect(201);
      }

      return request(app.getHttpServer())
        .get('/users?page=1&limit=5')
        .expect(200)
        .expect((res) => {
          expect(res.body.page).toBe(1);
          expect(res.body.limit).toBe(5);
          expect(res.body.data.length).toBeLessThanOrEqual(5);
        });
    });

    it('should filter users by email', async () => {
      // Create a test user first
      await request(app.getHttpServer())
        .post('/users')
        .send({
          email: 'filter.test@example.com',
          firstName: 'Filter',
          lastName: 'Test',
        })
        .expect(201);

      return request(app.getHttpServer())
        .get('/users?email=filter.test')
        .expect(200)
        .expect((res) => {
          expect(
            res.body.data.every((user: any) =>
              user.email.includes('filter.test'),
            ),
          ).toBe(true);
        });
    });

    it('should return 400 for invalid pagination parameters', () => {
      return request(app.getHttpServer())
        .get('/users?page=0&limit=101')
        .expect(400)
        .expect((res) => {
          expect(res.body.code).toBe('INVALID_USER_DATA');
        });
    });
  });

  describe('GET /users/:id', () => {

    it('should return a user by ID', async () => {
      // Create a test user first
      const createUserDto = {
        email: 'get.user@example.com',
        firstName: 'Get',
        lastName: 'User',
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      const createdUser = response.body;

      return request(app.getHttpServer())
        .get(`/users/${createdUser.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(createdUser.id);
          expect(res.body.email).toBe(createdUser.email);
          expect(res.body.firstName).toBe(createdUser.firstName);
          expect(res.body.lastName).toBe(createdUser.lastName);
        });
    });

    it('should return 404 for non-existent user', () => {
      return request(app.getHttpServer())
        .get('/users/999')
        .expect(404)
        .expect((res) => {
          expect(res.body.code).toBe('USER_NOT_FOUND');
          expect(res.body.message).toContain('not found');
        });
    });
  });

  describe('PATCH /users/:id', () => {

    it('should update a user successfully', async () => {
      // Create a test user first
      const createUserDto = {
        email: 'update.user@example.com',
        firstName: 'Update',
        lastName: 'User',
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      const createdUser = response.body;

      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
      };

      return request(app.getHttpServer())
        .patch(`/users/${createdUser.id}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(createdUser.id);
          expect(res.body.firstName).toBe(updateData.firstName);
          expect(res.body.lastName).toBe(updateData.lastName);
          expect(res.body.email).toBe(createdUser.email); // Should remain unchanged
          expect(new Date(res.body.updatedAt).getTime()).toBeGreaterThan(
            new Date(createdUser.updatedAt).getTime(),
          );
        });
    });

    it('should return 404 for non-existent user', () => {
      const updateData = { firstName: 'Updated' };

      return request(app.getHttpServer())
        .patch('/users/999')
        .send(updateData)
        .expect(404)
        .expect((res) => {
          expect(res.body.code).toBe('USER_NOT_FOUND');
        });
    });

    it('should return 400 for invalid update data', async () => {
      // Create a test user first
      const createUserDto = {
        email: 'update.validation@example.com',
        firstName: 'Update',
        lastName: 'Validation',
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      const createdUser = response.body;

      const invalidUpdateData = {
        email: 'invalid-email',
        firstName: 'Valid',
        lastName: 'Name',
      };

      return request(app.getHttpServer())
        .patch(`/users/${createdUser.id}`)
        .send(invalidUpdateData)
        .expect(400)
        .expect((res) => {
          expect(res.body.code).toBe('VALIDATION_ERROR');
        });
    });
  });

  describe('DELETE /users/:id', () => {

    it('should delete a user successfully', async () => {
      // Create a test user first
      const createUserDto = {
        email: 'delete.user@example.com',
        firstName: 'Delete',
        lastName: 'User',
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      const createdUser = response.body;

      return request(app.getHttpServer())
        .delete(`/users/${createdUser.id}`)
        .expect(204);
    });

    it('should return 404 for non-existent user', () => {
      return request(app.getHttpServer())
        .delete('/users/999')
        .expect(404)
        .expect((res) => {
          expect(res.body.code).toBe('USER_NOT_FOUND');
        });
    });

    it('should not find user after deletion', async () => {
      // Create a test user first
      const createUserDto = {
        email: 'delete.after@example.com',
        firstName: 'Delete',
        lastName: 'After',
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      const createdUser = response.body;

      // Delete the user
      await request(app.getHttpServer())
        .delete(`/users/${createdUser.id}`)
        .expect(204);

      // Try to get the user
      return request(app.getHttpServer())
        .get(`/users/${createdUser.id}`)
        .expect(404);
    });
  });
});

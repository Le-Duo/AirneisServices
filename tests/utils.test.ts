import { isAuth, isAdmin, sendPasswordResetEmail } from '../src/utils';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import '../src/types/Request';
import nodemailer from 'nodemailer';

// Mock nodemailer
jest.mock('nodemailer');
const mockedNodemailer = nodemailer as jest.Mocked<typeof nodemailer>;
const sendMailMock = jest.fn();
mockedNodemailer.createTransport.mockReturnValue({
  sendMail: sendMailMock,
} as any);

describe('Middleware functions', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
    process.env.JWT_SECRET = 'test_secret';
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  describe('isAuth middleware', () => {
    it('should call next() if token is valid', () => {
      const userPayload = { _id: '123', name: 'Test User', email: 'test@example.com', isAdmin: false };
      const token = jwt.sign(userPayload, process.env.JWT_SECRET!);
      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };

      isAuth(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', () => {
      mockRequest.headers = {
        authorization: 'Bearer invalidtoken',
      };

      isAuth(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.send).toHaveBeenCalledWith({ message: 'Invalid Token' });
    });

    // Add more tests for other scenarios, e.g., no token, no Bearer prefix, etc.
  });

  describe('isAdmin middleware', () => {
    it('should call next() if user is admin', () => {
      mockRequest.user = { _id: '123', name: 'Admin User', email: 'admin@example.com', isAdmin: true, password: 'placeholderPassword' };

      isAdmin(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });

    it('should return 401 if user is not admin', () => {
      mockRequest.user = { _id: '123', name: 'Regular User', email: 'user@example.com', isAdmin: false, password: 'placeholderPassword'};

      isAdmin(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.send).toHaveBeenCalledWith({ message: 'Not authorized as admin' });
    });
  });

  describe('sendPasswordResetEmail function', () => {
    it('should send an email with the correct format', async () => {
      const user = { _id: '123', name: 'Test User', email: 'test@example.com', isAdmin: false, password: 'placeholderPassword'};
      const token = 'testtoken123';

      await sendPasswordResetEmail(user, token);

      expect(sendMailMock).toHaveBeenCalledWith({
        from: '"Airneis Support" <support@airneis.com>',
        to: user.email,
        subject: 'Password Reset Request',
        text: expect.stringContaining(`http://localhost:5173/password-reset/${token}`),
      });
    });
  });
});
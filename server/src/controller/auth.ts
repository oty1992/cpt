import type { CookieOptions, OpineRequest, OpineResponse } from 'opine';
import type {
  AuthToken,
  IUserController,
  UserData,
  UserModel,
} from '~/types.ts';
import { compare, hash } from '~/helper/bcrypt.ts';
import { createJwtToken } from '~/helper/jwt.ts';
import { throwError } from '~/middleware/error_handler.ts';
import log from '~/util/logger.ts';
import { convertToMessage } from '~/util/message.ts';
import config from '~/config.ts';

export class UserController implements IUserController {
  #userRepository: UserModel;
  constructor(userRepository: UserModel) {
    this.#userRepository = userRepository;
  }

  getList = async (
    req: OpineRequest,
    res: OpineResponse<Omit<UserData, 'password'>[]>,
  ) => {
    const { method, baseUrl } = req;
    const users = (await this.#userRepository.getAll()).map((user) => {
      const { password: _password, ...rest } = user;
      return rest;
    });

    const msg = convertToMessage({
      method,
      baseUrl,
      status: 200,
    });
    log.debug(msg);
    res.setStatus(200).json(users);
  };

  signup = async (req: OpineRequest, res: OpineResponse<AuthToken>) => {
    const { username, password, email } = req.body;
    const { method, originalUrl } = req;
    const found = await this.#userRepository.findByUsername(username);
    if (found) {
      return throwError({
        method,
        baseUrl: originalUrl,
        status: 409,
        message: `${username} already exists`,
      });
    }

    const hashed = hash(password);
    const userId = await this.#userRepository.create({
      username,
      password: hashed,
      email,
    });
    const token = await createJwtToken(userId);
    const msg = convertToMessage({
      method,
      baseUrl: originalUrl,
      status: 201,
      message: `user(${userId}) sign up`,
    });
    log.debug(msg);

    setToken(res, token);
    res.setStatus(201).json({ token, username, userId });
  };

  login = async (req: OpineRequest, res: OpineResponse<AuthToken>) => {
    const { method, originalUrl } = req;
    const { username, password } = req.body;
    const user = await this.#userRepository.findByUsername(username);
    if (!user) {
      return throwError({
        method,
        baseUrl: originalUrl,
        status: 401,
        message: `Invalid username or password`,
      });
    }
    const isValidPassword = compare(password, user.password);
    if (!isValidPassword) {
      return throwError({
        method,
        baseUrl: originalUrl,
        status: 401,
        message: `Invalid username or password`,
      });
    }

    const token = await createJwtToken(user.id);
    const msg = convertToMessage({
      method,
      baseUrl: originalUrl,
      status: 200,
      message: `user(${user.id}) is login`,
    });
    log.debug(msg);

    setToken(res, token);
    res.setStatus(200).json({ token, username, userId: user.id });
  };

  logout = (req: OpineRequest, res: OpineResponse) => {
    const { method, originalUrl } = req;
    res.cookie('token', '', { httpOnly: true, sameSite: 'None', secure: true });
    const msg = convertToMessage({
      method,
      baseUrl: originalUrl,
      status: 200,
    });
    log.debug(msg);

    res.setStatus(200).json({ message: 'User has been logged out' });
  };

  me = async (req: OpineRequest, res: OpineResponse<AuthToken>) => {
    const { method, originalUrl } = req;
    const user = await this.#userRepository.findById(req.body.userId);
    if (!user) {
      return throwError({
        method,
        baseUrl: originalUrl,
        status: 404,
        message: 'User not found',
      });
    }

    const msg = convertToMessage({
      method,
      baseUrl: originalUrl,
      status: 200,
    });
    log.debug(msg);
    res.setStatus(200).json({
      token: req.body.token,
      username: user.username,
      userId: user.id,
    });
  };
}

function setToken(res: OpineResponse, token: string) {
  const options: CookieOptions = {
    maxAge: config.jwt.expiresInSec,
    httpOnly: true,
    sameSite: 'None',
    secure: true,
  };

  res.cookie('token', token, options);
}

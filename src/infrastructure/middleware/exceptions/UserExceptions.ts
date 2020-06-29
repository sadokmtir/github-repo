import HttpException from './HttpException';

export const UserNotFoundException = new HttpException(404, 'User does not exist.');
export const UserIdNotValidException = new HttpException(400, 'User id is not valid.');

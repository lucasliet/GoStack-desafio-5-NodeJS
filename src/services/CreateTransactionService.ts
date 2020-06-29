// import AppError from '../errors/AppError';

import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getRepository(Transaction);
    const categoryRepository = getRepository(Category);

    const categoryInDB = await categoryRepository.findOne({
      where: { title: category },
    });

    let newCategoryId;
    if (!categoryInDB) {
      const newCategory = categoryRepository.create({
        title: category,
      });
      const { id } = await categoryRepository.save(newCategory);
      newCategoryId = id;
    }

    const newTransaction = transactionRepository.create({
      title,
      type,
      value,
      category_id: newCategoryId ?? categoryInDB?.id,
    });

    transactionRepository.save(newTransaction);
    return newTransaction;
  }
}

export default CreateTransactionService;

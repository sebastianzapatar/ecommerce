import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { IsUUID, isUUID } from 'class-validator';
import { ProductImage } from './entities/productimage.entity';


@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource
  ) { }
  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDetail } = createProductDto;
      const product = this.productRepository.create({
        ...createProductDto,
        images: images.map(image => this.productImageRepository.create({ url: image }))
      });
      console.log(product.images);

      await this.productRepository.save(product);
      return { ...product, images };
    }
    catch (e) {
      console.log(e);

    }
  }

  async findAll(paginationDTO: PaginationDTO) {
    const { limit = 10, offset = 0 } = paginationDTO;
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: { images: true }
    });
    return products;

  }

  async findOne(id: string) {
    let product: Product;
    if (isUUID(id)) {
      product = await this.productRepository.findOneBy({ id: id });
      return product;
    }

    const query = this.productRepository.createQueryBuilder('prod');
    product = await query.where('title=:title or slug=:slug', {
      title: id,
      slug: id,
    }).leftJoinAndSelect('prod.images', 'images')
      .getOne()//Para que no hagan inyeccion de dependencias
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const { images, ...toUpdate } = updateProductDto;
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
      images: []
    });
    if (!product) throw new NotFoundException('Producto not found');
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, {
          product: { id }
        })
        product.images = images.map(image => this.productImageRepository.create({ url: image }))

      }

      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      await this.productRepository.save(product);
    }
    catch (e) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
    }
    return product;
  }

  async remove(id: string) {
    const product = await this.productRepository.delete({ id: id });
    return product;
  }
}

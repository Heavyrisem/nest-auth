import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { ConfigurationModule } from '../config/config.module';
import { options } from './typeorm.datasource';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigurationModule],
      useFactory: () => options,
      dataSourceFactory: async (opt) => {
        console.log('♺ Connecting to DataBase');
        const dataSource = await new DataSource(opt).initialize();
        console.log('✔ DataBase connect Success ');
        return dataSource;
      },
    }),
  ],
})
export class DatabaseModule {}

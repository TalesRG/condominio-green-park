import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { BoletoModule } from './module/boleto.module';
import process from 'node:process';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: String(process.env.HOST_DB),
      port: Number(process.env.PORT_DB),
      username: String(process.env.DB_USER),
      password: String(process.env.PASSWORD),
      database: String(process.env.DATABASE),
      entities: [__dirname + '/entity/**/*{.ts,.js}'],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      synchronize: false,
      migrationsRun: true,
    }),
    BoletoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

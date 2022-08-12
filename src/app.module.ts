import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { ConfigurationModule } from './modules/config/config.module';
import { DatabaseModule } from './modules/database/database.module';
import { JwtMiddleware } from './modules/jwt/jwt.middleware';
import { JwtModule } from './modules/jwt/jwt.module';
import { LoggerMiddleware } from './modules/logging/logger.middleware';
import { UserModule } from './user/user.module';
import { TestController } from './test/test.controller';

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule,
    JwtModule.ForRoot({ privateKey: process.env.JWT_SECRET }),
    UserModule,
  ],
  controllers: [TestController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer.apply(JwtMiddleware).forRoutes('*');
  }
}

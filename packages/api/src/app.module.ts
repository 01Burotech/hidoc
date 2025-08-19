import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { BullModule } from '@nestjs/bullmq';
import { S3Client } from '@aws-sdk/client-s3';
import { envSchema } from './config/env.schema';
import { HealthResolver } from './health.resolver';
import { LoggerModule } from 'nestjs-pino';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GqlContext } from './common/decorators/gql-context.interface';
import { MedecinModule } from './medecin/medecin.module';
import { AvailabilityModule } from './availability/availability.module';
import { AppointmentsModule } from './appointment/appointment.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';
import { PatientsModule } from './patient/patient.module';
import { PharmaciesModule } from './pharmacies/pharmacies.module';
import { PaymentsModule } from './payments/payments.module';
import { TeleconsultationModule } from './teleconsultation/teleconsultation.module';
import { SignatureModule } from './signature/signature.module';
import { PharmacyDispatchModule } from './pharmacies/dispatch/pharmacy-dispatch.module';
import { MessagingModule } from './messaging/messaging.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
    // Config global
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => envSchema.parse(config),
    }),

    // TypeORM Async
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        if (!databaseUrl) throw new Error('DATABASE_URL is required');

        return {
          type: 'postgres',
          url: databaseUrl,
          autoLoadEntities: true,
          synchronize: configService.get<string>('NODE_ENV') !== 'production',
        };
      },
    }),

    // BullMQ Async
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: { url: configService.get<string>('REDIS_URL') },
      }),
    }),

    // GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      context: ({ req }: GqlContext) => ({ req }),
    }),
    // Logger
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  singleLine: true,
                  translateTime: 'SYS:standard',
                },
              }
            : undefined,
      },
    }),
    AuthModule,
    UsersModule,
    MedecinModule,
    AvailabilityModule,
    AppointmentsModule,
    PrescriptionsModule,
    PatientsModule,
    PharmaciesModule,
    PaymentsModule,
    TeleconsultationModule,
    SignatureModule,
    PharmacyDispatchModule,
    MessagingModule,
    NotificationsModule,
    AuditModule,
  ],
  providers: [
    HealthResolver,
    // S3 Client
    {
      provide: 'S3_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new S3Client({
          endpoint: configService.get<string>('S3_ENDPOINT') || '',
          region: 'us-east-1',
          credentials: {
            accessKeyId: configService.get<string>('S3_ACCESS_KEY') || '',
            secretAccessKey: configService.get<string>('S3_SECRET_KEY') || '',
          },
          forcePathStyle: true,
        });
      },
    },

    // Mailer mock
    {
      provide: 'MAILER',
      useValue: {
        sendMail: () => ({ success: true }),
      },
    },

    // SMS mock
    {
      provide: 'SMS',
      useValue: {
        sendSms: () => ({ success: true }),
      },
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}

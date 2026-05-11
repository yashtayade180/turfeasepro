import * as dotenv from "dotenv";
import * as Joi from "joi";

dotenv.config();

const envSchema = Joi.object({
  PORT: Joi.number().default(3000),
  MONGO_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  RAZORPAY_KEY_ID: Joi.string().optional(),
  RAZORPAY_KEY_SECRET: Joi.string().optional(),
  REDIS_URL: Joi.string().optional()
}).unknown();

const { error, value: env } = envSchema.validate(process.env);

if (error) {
  throw new Error(`❌ Invalid environment variables: ${error.message}`);
}

export default env;

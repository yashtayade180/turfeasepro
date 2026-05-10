import * as dotenv from "dotenv";
import * as Joi from "joi";

dotenv.config();

const envSchema = Joi.object({
  PORT: Joi.number().default(5000),
  MONGO_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  RAZORPAY_KEY_ID: Joi.string().required(),
  RAZORPAY_KEY_SECRET: Joi.string().required(),
  REDIS_URL: Joi.string().required()
}).unknown();

const { error, value: env } = envSchema.validate(process.env);

if (error) {
  throw new Error(`❌ Invalid environment variables: ${error.message}`);
}

export default env;

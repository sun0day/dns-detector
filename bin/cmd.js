#!/usr/bin/env node

import { argv as args } from "node:process";
import { resolve, stdout } from "../index.mjs";

const optionSchema = {
  server: {
    type: String,
  },
  host: {
    required: true,
    type: String,
  },
  timeout: {
    default: 2000,
    type: Number,
  },
  tries: {
    default: 4,
    type: Number,
  },
};

function resolveOptions(args) {
  const options = {};
  let optKey = "";
  args.forEach((arg, index) => {
    if (index < 2) {
      return;
    }

    const [key, value] = arg.replace(/^--/, "").split("=");

    if (!optKey && !value && !optionSchema[key]) {
      stdout.error(`unknown option ${arg}\n`);
      process.exit(1);
    }

    if (value) {
      options[key] = value;
    } else {
      if (optKey) {
        options[optKey] = key;
        optKey = "";
      } else {
        optKey = key;
      }
    }
  });

  Object.keys(optionSchema).forEach((key) => {
    const { required, type, default: dv } = optionSchema[key];
    if (!options[key]) {
      if (required) {
        stdout.error(`${key} option is required\n`);
        process.exit(1);
      } else {
        options[key] = dv;
      }
    }
    options[key] = type(options[key]);
  });

  return options;
}

resolve(resolveOptions(args));

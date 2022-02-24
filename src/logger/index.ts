export const log = (message: any) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(message);
  }
};

export const error = (message: any) => {
  if (process.env.NODE_ENV !== "production") {
    console.error(message);
  }
};

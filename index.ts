import expess from "express";
import router from "./src/router";

const app = expess();

app.use(expess.json());
app.use("/survey", router);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

module.exports = (plop) => {
  plop.setGenerator("component", {
    description: "Add an unconnected component",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "what do you want a component to be called?",
      },
    ],
    actions: [
      {
        type: "add",
        path: "./src/components/{{properCase name}}/index.tsx",
        templateFile: "./src/generators/index.tsx.hbs",
        abortOnFail: true,
      },
      {
        type: "add",
        path: "./src/components/{{properCase name}}/{{properCase name}}.tsx",
        templateFile: "./src/generators/component.tsx.hbs",
        abortOnFail: true,
      },
    ],
  });
};

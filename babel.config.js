module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    // If you use Reanimated, add its plugin here (must be last)
    plugins: ["react-native-reanimated/plugin"],
  };
};
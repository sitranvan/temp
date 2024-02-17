const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
module.exports = (env) => {
  const isDevelopment = Boolean(env.development);

  return {
    mode: isDevelopment ? "development" : "production",
    entry: {
      app: path.resolve("src/index.js"), // tên file build xong tên là app.js
    },
    output: {
      path: path.resolve(__dirname, "dist"), // thư mục chứa file build
      filename: "[name].[contenthash].js", // tên file build xong là app.js và có thêm contenthash vào tên file để tránh cache js
      clean: true, // xóa file build cũ đi khi build file mới
      assetModuleFilename: "[file]", // tên file asset khi build xong giữ nguyên tên file gốc  (ví dụ ảnh, pdf, ...)
    },
    devtool: isDevelopment ? "source-map" : false, // tạo file source map
    // Load css
    module: {
      rules: [
        {
          test: /\.s[ac]ss|css$/i,
          use: [
            // Creates `style` nodes from JS strings
            // "style-loader",
            MiniCssExtractPlugin.loader,
            // Translates CSS into CommonJS
            "css-loader",
            // Compiles Sass to CSS
            "sass-loader",
          ],
        },
        {
          test: /\.(png|jpg|gif|jpeg|pdf)$/i,
          type: "asset/resource",
        },
        {
          test: /\.(?:js|mjs|cjs)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    debug: true, // hiển thị thông tin log khi build
                    useBuiltIns: "usage", // tự động import các polyfill cần thiết, nếu dùng entry thì phải import thủ công
                    corejs: "3.35.1", // sử dụng core-js version 3
                  },
                ],
              ],
            },
          },
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        // Tên file build xong là app.css và có thêm contenthash vào tên file để tránh cache css
        filename: "[name].[contenthash].css",
      }),
      new HtmlWebpackPlugin({
        title: "Webpack App",
        filename: "index.html",
        template: path.resolve("src/template.html"),
      }),
      new BundleAnalyzerPlugin(), // tạo file report khi build
    ],
    // Tạo server
    devServer: {
      static: {
        directory: "disk",
      },
      port: 9000, // port mặc định là 8080
      open: true, // mở trình duyệt khi chạy lệnh start
      hot: true, // hot reload khi có thay đổi
      historyApiFallback: true, // set true nếu dùng cho các SPA (single page application) và sử dụng History API của HTML5
    },
  };
};

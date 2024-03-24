const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development', // Set the mode to development or production
  entry: './App.tsx', // Update this if your entry file has a different name or path
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'], // Add '.tsx' and '.ts'
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/, // Handle .ts and .tsx files
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader', // Using ts-loader for TypeScript
        },
      },
      // ... (other rules like for CSS or images)
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // Path to your HTML template
    }),
  ],
  // ... (other configurations)
};

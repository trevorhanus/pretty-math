const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const merge = require('webpack-merge');
const Dotenv = require('dotenv-webpack');

const tsconfigPath = path.join(__dirname, '../tsconfig.json');

module.exports = (opts) => {
    if (opts == null) {
        throw new Error(`Expected command line options. Use '--env.command=your_command' and '--env.env=your_env'`);
    }

    const { command } = opts;

    switch (command) {
        case 'start':
            return merge(config(), devServer());

        case 'build':
            return config();

        default:
            throw new Error(`Unrecognized command '${command}'.`);
    }
};

const devServer = () => {
    return {
        mode: 'development',
        devServer: {
            compress: true,
                historyApiFallback: true,
                port: 8080,
        },
    }
};

const config = () => {

    return {
        devtool: 'eval',
        mode: 'production',
        entry: path.join(__dirname, './src/index'),
        output: {
            path: path.join(__dirname, '.dist'),
            filename: 'bundle.[hash:8].js',
            publicPath: '/',
        },
        plugins: [
            // new Dotenv(),
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: path.join(__dirname, 'index.html'),
                inject: 'body',
            }),
        ],
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
            plugins: [
                new TsconfigPathsPlugin({
                    configFile: tsconfigPath,
                    extensions: ['.ts', '.tsx', '.js'],
                }),
            ],
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                plugins: [
                                    // '@babel/plugin-transform-modules-commonjs',
                                    // 'babel-plugin-syntax-dynamic-import'
                                ]
                            }
                        },
                        {
                            loader: 'ts-loader',
                            options: {
                                transpileOnly: true,
                                experimentalWatchApi: true,
                                compilerOptions: {
                                    // need to use esnext here so that typescript
                                    // will properly handle the import() statements
                                    module: 'esnext',

                                    // do not need the incremental flag here
                                    // since we are not running ts checking
                                    incremental: false,
                                }
                            }
                        }
                    ],
                },
                {
                    test: /\.scss$/,
                    use: [
                        { loader: 'style-loader' },
                        { loader: 'css-loader' }, // translates CSS into CommonJS modules
                        {
                            loader: 'postcss-loader', // Run post css actions
                            options: {
                                plugins: () => {
                                    return [
                                        require('precss'),
                                        require('autoprefixer'),
                                    ];
                                },
                            },
                        },
                        {
                            loader: 'resolve-url-loader',
                            options: {
                            }
                        },
                        {
                            loader: 'sass-loader', // compiles SASS to CSS
                            options: {
                                sourceMap: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
                    loader: 'file-loader',
                    query: {
                        name: 'assets/[name].[hash:8].[ext]',
                    },
                },
            ],
        },
    }
};

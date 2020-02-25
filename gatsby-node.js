const fs = require('fs');
const util = require('util');
const webpack = require('webpack');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

exports.onPostBuild = async ({ reporter }) => {
    // replace prefix paths for manifest file   
    const path = 'public/manifest.webmanifest';
    const buffer = await readFileAsync(path);
    let contents = buffer.toString();

    if (!contents.includes('__GATSBY_IPFS_PATH_PREFIX__')) {
        return;
    }

    contents = contents
    .replace("\"/__GATSBY_IPFS_PATH_PREFIX__\"", "\"/\"")
    .replace(/\/__GATSBY_IPFS_PATH_PREFIX__\//g, "/");

    await writeFileAsync(path, contents);
}

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
    actions.setWebpackConfig({
        plugins: [new webpack.IgnorePlugin(/^electron$/)]
    });

    if (stage === "build-html") {
        actions.setWebpackConfig({
            module: {
                rules: [
                    {
                        test: /portis\.js|authereum\.js|torus-embed|qrcode-modal/,
                        use: loaders.null(),
                    },
                ],
            },
        });
    }
};

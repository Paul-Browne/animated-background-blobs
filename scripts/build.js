import * as esbuild from 'esbuild'

const commonBuildParams = {
    entryPoints: ['abb.js'],
    bundle: true,
    minify: true,
    sourcemap: true,
    format: "iife",    
}

await Promise.all([
    {
        outfile: 'abb.iife.min.js'
    },
    {
        outfile: 'demo/js/abb.iife.min.js'
    },
    {
        format: "esm",
        outfile: 'abb.iife.min.js'
    }        
].map(build => esbuild.build({
    ...commonBuildParams,
    ...build
})))

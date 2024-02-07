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
        outfile: 'docs/js/abb.iife.min.js'
    },
    {
        format: "esm",
        outfile: 'abb.esm.min.js'
    }        
].map(build => esbuild.build({
    ...commonBuildParams,
    ...build
})))

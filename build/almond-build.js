({
    baseUrl: "../src",
    name: "../build/wrap/almond",
    include: "main",
    // optimize: "none",
    out: 'dist/ycharts-almond.min.js',
    wrap: {
        startFile: './wrap/start.js',
        endFile: './wrap/end.js'
    }
})
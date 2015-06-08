/*global module */
module.exports = function( grunt ) {
    'use strict';

    grunt.initConfig({
        meta: {
          version: '2.8.3',
          banner: '/*!\n' +
            ' * Modernizr v<%= meta.version %>\n' +
            ' * www.modernizr.com\n *\n' +
            ' * Copyright (c) Faruk Ates, Paul Irish, Alex Sexton\n' +
            ' * Available under the BSD and MIT licenses: www.modernizr.com/license/\n */'
        },
        qunit: {
            files: ['test/index.html']
        },
        lint: {
            files: [
                'grunt.js',
                'modernizr.js',
                'feature-detects/*.js'
            ]
        },
        min: {
            dist: {
                src: [
                    '<banner:meta.banner>',
                    'modernizr.js'
                ],
                dest: 'modernizr.min.js'
            }
        },
        watch: {
            files: '<config:lint.files>',
            tasks: 'lint'
        },
        jshint: {
            options: {
                boss: true,
                browser: true,
                curly: false,
                devel: true,
                eqeqeq: false,
                eqnull: true,
                expr: true,
                evil: true,
                immed: false,
                laxcomma: true,
                newcap: false,
                noarg: true,
                smarttabs: true,
                sub: true,
                undef: true
            },
            globals: {
                Modernizr: true,
                DocumentTouch: true,
                TEST: true,
                SVGFEColorMatrixElement : true,
                Blob: true
            }
        }
    });

    grunt.registerTask('default', 'min');

    // Travis CI task.
    grunt.registerTask('travis', 'qunit');
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZ3J1bnQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLypnbG9iYWwgbW9kdWxlICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBncnVudCApIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBncnVudC5pbml0Q29uZmlnKHtcbiAgICAgICAgbWV0YToge1xuICAgICAgICAgIHZlcnNpb246ICcyLjguMycsXG4gICAgICAgICAgYmFubmVyOiAnLyohXFxuJyArXG4gICAgICAgICAgICAnICogTW9kZXJuaXpyIHY8JT0gbWV0YS52ZXJzaW9uICU+XFxuJyArXG4gICAgICAgICAgICAnICogd3d3Lm1vZGVybml6ci5jb21cXG4gKlxcbicgK1xuICAgICAgICAgICAgJyAqIENvcHlyaWdodCAoYykgRmFydWsgQXRlcywgUGF1bCBJcmlzaCwgQWxleCBTZXh0b25cXG4nICtcbiAgICAgICAgICAgICcgKiBBdmFpbGFibGUgdW5kZXIgdGhlIEJTRCBhbmQgTUlUIGxpY2Vuc2VzOiB3d3cubW9kZXJuaXpyLmNvbS9saWNlbnNlL1xcbiAqLydcbiAgICAgICAgfSxcbiAgICAgICAgcXVuaXQ6IHtcbiAgICAgICAgICAgIGZpbGVzOiBbJ3Rlc3QvaW5kZXguaHRtbCddXG4gICAgICAgIH0sXG4gICAgICAgIGxpbnQ6IHtcbiAgICAgICAgICAgIGZpbGVzOiBbXG4gICAgICAgICAgICAgICAgJ2dydW50LmpzJyxcbiAgICAgICAgICAgICAgICAnbW9kZXJuaXpyLmpzJyxcbiAgICAgICAgICAgICAgICAnZmVhdHVyZS1kZXRlY3RzLyouanMnXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIG1pbjoge1xuICAgICAgICAgICAgZGlzdDoge1xuICAgICAgICAgICAgICAgIHNyYzogW1xuICAgICAgICAgICAgICAgICAgICAnPGJhbm5lcjptZXRhLmJhbm5lcj4nLFxuICAgICAgICAgICAgICAgICAgICAnbW9kZXJuaXpyLmpzJ1xuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgZGVzdDogJ21vZGVybml6ci5taW4uanMnXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHdhdGNoOiB7XG4gICAgICAgICAgICBmaWxlczogJzxjb25maWc6bGludC5maWxlcz4nLFxuICAgICAgICAgICAgdGFza3M6ICdsaW50J1xuICAgICAgICB9LFxuICAgICAgICBqc2hpbnQ6IHtcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBib3NzOiB0cnVlLFxuICAgICAgICAgICAgICAgIGJyb3dzZXI6IHRydWUsXG4gICAgICAgICAgICAgICAgY3VybHk6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGRldmVsOiB0cnVlLFxuICAgICAgICAgICAgICAgIGVxZXFlcTogZmFsc2UsXG4gICAgICAgICAgICAgICAgZXFudWxsOiB0cnVlLFxuICAgICAgICAgICAgICAgIGV4cHI6IHRydWUsXG4gICAgICAgICAgICAgICAgZXZpbDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBpbW1lZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgbGF4Y29tbWE6IHRydWUsXG4gICAgICAgICAgICAgICAgbmV3Y2FwOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBub2FyZzogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzbWFydHRhYnM6IHRydWUsXG4gICAgICAgICAgICAgICAgc3ViOiB0cnVlLFxuICAgICAgICAgICAgICAgIHVuZGVmOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2xvYmFsczoge1xuICAgICAgICAgICAgICAgIE1vZGVybml6cjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBEb2N1bWVudFRvdWNoOiB0cnVlLFxuICAgICAgICAgICAgICAgIFRFU1Q6IHRydWUsXG4gICAgICAgICAgICAgICAgU1ZHRkVDb2xvck1hdHJpeEVsZW1lbnQgOiB0cnVlLFxuICAgICAgICAgICAgICAgIEJsb2I6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgZ3J1bnQucmVnaXN0ZXJUYXNrKCdkZWZhdWx0JywgJ21pbicpO1xuXG4gICAgLy8gVHJhdmlzIENJIHRhc2suXG4gICAgZ3J1bnQucmVnaXN0ZXJUYXNrKCd0cmF2aXMnLCAncXVuaXQnKTtcbn07XG4iXSwiZmlsZSI6Im1vZGVybml6ci9ncnVudC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
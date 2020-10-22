'use strict'

const gamma_corr = 2.2  // 2.2 is standard

const sorted_palettes = {}
Object.keys(palettes).sort().forEach(function (key) {
    sorted_palettes[key] = palettes[key]
})
palettes = sorted_palettes

const colors = []
const palettes_w_ids = {}
const classified_colors = {
    'reddish': [],
    'yellowish': [],
    'greenish': [],
    'cyanish': [],
    'bluish': [],
    'magentish': [],
    'grayish': [],
}

let n = 0
for (let palette_name in palettes) {
    palettes_w_ids[palette_name] = []
    for (let i = 0; i < palettes[palette_name].length; i++) {
        palettes_w_ids[palette_name].push([])
        for (let j = 0; j < palettes[palette_name][i].length; j++, n++) {
            let hex = palettes[palette_name][i][j]
            let [r, g, b] = hex_to_rgb(hex)
            r **= gamma_corr
            g **= gamma_corr
            b **= gamma_corr
            let rgb_summ = r + g + b
            let r_rat = r / rgb_summ
            let g_rat = g / rgb_summ
            let b_rat = b / rgb_summ
            let y_rat = (r + g) / rgb_summ
            let c_rat = (g + b) / rgb_summ
            let m_rat = (r + b) / rgb_summ
            let color_family

            if (r_rat > 0.5 && g_rat < 0.35 && b_rat < 0.175) {
                color_family = 'reddish'
            }
            else if (g_rat > 0.45 && r_rat < 0.4 && b_rat < 0.3) {
                color_family = 'greenish'
            }
            else if (b_rat > 0.42 && r_rat < 0.16 && g_rat < 0.49) {
                color_family = 'bluish'
            }
            else if (m_rat > 0.7 && g_rat < 0.3) {
                color_family = 'magentish'
            }
            else if (y_rat > 0.7 && b_rat < 0.275) {
                color_family = 'yellowish'
            }
            else if (c_rat > 0.7) {
                color_family = 'cyanish'
            }
            else {
                color_family = 'grayish'
            }

            colors.push({'color': hex, 'palette': palette_name, 'x': j, 'y': i, 'color_family': color_family})
            palettes_w_ids[palette_name][i].push(n)
            classified_colors[color_family].push(n)
        }
    }
}

for (let cl_colors_gr_name in classified_colors) {
    classified_colors[cl_colors_gr_name].sort(function(a, b) {
        const [r1, g1, b1] = hex_to_rgb(colors[a].color)
        const [r2, g2, b2] = hex_to_rgb(colors[b].color)
        return (r2**gamma_corr + g2**gamma_corr + b2**gamma_corr) -
               (r1**gamma_corr + g1**gamma_corr + b1**gamma_corr)
    })
}

let duplicates = {}
for (let color_id = 0; color_id < colors.length; color_id++) {
    let color = colors[color_id].color
    if (color in duplicates) {
        duplicates[color].push(color_id)
    }
    else {
        duplicates[color] = [color_id]
    }
}
for (let [color, col_ids] of Object.entries(duplicates)) {
    if (col_ids.length < 2) {
        delete duplicates[color]
    }
}
const sorted_duplicates = {}
Object.keys(duplicates).sort().reverse().forEach(function (key) {
    sorted_duplicates[key] = duplicates[key]
})
duplicates = sorted_duplicates

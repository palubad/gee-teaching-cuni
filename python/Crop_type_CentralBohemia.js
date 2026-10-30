//VERSION=3

const factor = 1;
const offset = 0;

function setup() {
    return {
        input: ["CTY", "dataMask"],
        output: [
            { id: "default", bands: 4, sampleType: "UINT8" },
            { id: "index", bands: 1, sampleType: "FLOAT32" },
            { id: "browserStats", bands: 1, sampleType: "FLOAT32" },
            { id: "dataMask", bands: 1 }
        ]
    };
}

const ColorBar = [
    [1110, [231, 198, 255]], // Pšenice
    [1120, [251, 162, 74]],
    [1130, [118, 200, 147]], // Ječmen
    [1140, [233, 67, 1]],
    [1150, [232, 169, 149]],
    [1210, [248, 173, 157]], // Kukuřice
    [1220, [181, 131, 141]],
    [1310, [144, 224, 239]], // Ostatní obiloviny
    [1320, [156, 91, 12]],
    [1410, [255, 227, 168]], // Řepka
    [1420, [168, 106, 150]],
    [1430, [227, 119, 194]],
    [1440, [247, 182, 210]],
    [2100, [219, 219, 141]],
    [2200, [193, 206, 18]],
    [2310, [121, 160, 58]],
    [2320, [90, 124, 48]],
    [3100, [215, 215, 215]],
    [3200, [171, 171, 171]]
];

function getColor(value) {
    // Exact code match check
    for (let i = 0; i < ColorBar.length; i++) {
        if (ColorBar[i][0] === value) {
            return ColorBar[i][1];
        }
    }
    // Fallback: Nearest entry if not an exact match
    let closestEntry = ColorBar[0];
    let minDiff = Math.abs(ColorBar[0][0] - value);
    for (let i = 1; i < ColorBar.length; i++) {
        let diff = Math.abs(ColorBar[i][0] - value);
        if (diff < minDiff) {
            minDiff = diff;
            closestEntry = ColorBar[i];
        }
    }
    return closestEntry[1];
}

function evaluatePixel(samples) {
    const originalValue = samples.CTY;
    const val = originalValue * factor + offset;
    const dataMask = samples.dataMask;

    const EXCLUDED_VALUES = [0, 65535];
    const isExcluded = dataMask === 0 || EXCLUDED_VALUES.includes(val);

    if (isExcluded) {
        return {
            default: [0, 0, 0, 0],
            index: [NaN],
            browserStats: [NaN],
            dataMask: [0]
        };
    }

    const rgb = getColor(val);
    return {
        default: [rgb[0], rgb[1], rgb[2], 255],
        index: [val],
        browserStats: [val],
        dataMask: [dataMask]
    };
}

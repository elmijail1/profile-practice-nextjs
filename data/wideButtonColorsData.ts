type colorObject = {
    name: string,
    textColor: string,
    backgroundColor: string,
    borderColor: string,
    behindColor: string,
}

export function extractColorObject(arrayOfColorObjects: colorObject[], colorName: string) {
    return arrayOfColorObjects.filter((entry: colorObject) => entry.name === colorName)[0];
}

export const wideButtonColorsData = [
    {
        name: "GreenFill",
        textColor: "0, 0%, 100%",
        backgroundColor: "130, 70%, 50%",
        borderColor: "130, 70%, 50%",
        behindColor: "Green",
    },
    {
        name: "GreenText",
        textColor: "130, 70%, 50%",
        backgroundColor: "0, 0%, 100%",
        borderColor: "130, 70%, 50%",
        behindColor: "Green",
    },
    {
        name: "RedText",
        textColor: "0, 70%, 80%",
        backgroundColor: "0, 0%, 100%",
        borderColor: "0, 70%, 80%",
        behindColor: "Red",
    },
];

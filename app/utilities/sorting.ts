export function changeSorting(
    name: string,
    setActiveSortingState: any,
    setSortingOptionsMenuState: any
) {
    setActiveSortingState(name);
    setSortingOptionsMenuState;
}

export function determineSortingButtonName(
    sortingOptionsData: any,
    activeSortingState: string
) {
    return sortingOptionsData.map((sortingOption: any) => {
        if (sortingOption.name === activeSortingState) {
            return sortingOption.displayName;
        }
    });
}

function createArrayOfValuesAndIDs(initialDataArray: any[], sortingMethod: string) {
    const filteredArrayWithValuesAndIDs: any[] = [];
    initialDataArray.map((entry) => {
        if (sortingMethod === "joinedIn") {
            //joinedIn contains Date and it must be first parsed before sorting
            filteredArrayWithValuesAndIDs.push({
                value: Date.parse(entry[sortingMethod]),
                id: entry.id,
            });
        } else {
            filteredArrayWithValuesAndIDs.push({
                value: entry[sortingMethod],
                id: entry.id,
            });
        }
    });
    return filteredArrayWithValuesAndIDs.sort();
}

function sortArrayOfValuesAndIDs(arrayOfValuesAndIDs: any[]) {
    const arrayOfJustValues: any[] = [];
    arrayOfValuesAndIDs.map((entry) => {
        arrayOfJustValues.push(entry.value);
    });
    const sortedArrayOfJustValues = arrayOfJustValues.sort();

    const arrayOfSortedValuesAndIDs: any[] = [];
    sortedArrayOfJustValues.map((justValue) => {
        arrayOfValuesAndIDs.map((entry) => {
            if (
                justValue === entry.value &&
                !arrayOfSortedValuesAndIDs.some(
                    (e) => e.value === justValue && e.id === entry.id
                )
            ) {
                arrayOfSortedValuesAndIDs.push(entry);
            }
        });
    });

    return arrayOfSortedValuesAndIDs;
}

function createArrayOfSortedObjects(
    initialDataArray: any[],
    sortingMethod: string,
    arrayOfObjects: any[]
) {
    const finalArrayWithSimpleValues: any[] = [];
    arrayOfObjects.map((valueAndID) => {
        initialDataArray.map((entry) => {
            if (
                sortingMethod === "joinedIn" &&
                Date.parse(entry[sortingMethod]) === valueAndID.value &&
                entry.id === valueAndID.id
            ) {
                finalArrayWithSimpleValues.push(entry);
            }
            if (
                entry[sortingMethod] === valueAndID.value &&
                entry.id === valueAndID.id
            ) {
                finalArrayWithSimpleValues.push(entry);
            }
        });
    });

    return finalArrayWithSimpleValues;
}

export function sortBy(initialDataArray: any[], sortingMethod: string) {
    const arrayOfValuesAndIDs = createArrayOfValuesAndIDs(
        initialDataArray,
        sortingMethod
    );

    const sortedArrayOfValuesAndIDs =
        sortArrayOfValuesAndIDs(arrayOfValuesAndIDs);

    return createArrayOfSortedObjects(
        initialDataArray,
        sortingMethod,
        sortedArrayOfValuesAndIDs
    );
}
export type stageType = {
    stage: string,
    date: string
}

export type companyType = {
    name: string,
    actions: Array<stageType>
}

export type boardType = {
    [key: string]: companyType
}
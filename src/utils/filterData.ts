const getPlayerMainPos = (index: number) => {
    switch (index) {
        case 0: return '对抗路';
        case 1: return '中路';
        case 2: return '发育';
        case 3: return '打野';
        case 4: return '游走';
        default: return '--';
    }
}
// eslint-disable-next-line import/prefer-default-export
export { getPlayerMainPos }
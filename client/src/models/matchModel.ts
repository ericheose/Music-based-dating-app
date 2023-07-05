export interface Match {
    _id: string,
    userId: string,
    matchedWithId: string,
    sharedMusic: {
        sharedsongs: string[],
        sharedartists: string[],
        sharedalbums: string[],
        sharedgenres: string[],
    }
    
}
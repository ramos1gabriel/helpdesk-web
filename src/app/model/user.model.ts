export class User {
    constructor(
        public id: string,
        public email : string,
        public password : string,
        public profile : string
    ){}

    //TESTE F5
    /*public toString(){
        return this.id+","+this.email+","+this.password+","+this.profile;
    }*/
}
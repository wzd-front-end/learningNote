class UserInfo {
  public readonly name: string
  constructor(name: string){
    this.name = name
  }
  getName () {
    return this.name
  }
}

const userInfo = new UserInfo('wzd')
console.log(userInfo.getName())

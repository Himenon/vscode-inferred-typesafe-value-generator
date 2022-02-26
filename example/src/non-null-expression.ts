export interface Owner {
  name: string;
  age?: number;
  hoge?: {
    value?: string;
  };
}

export interface MyService {
  ownerAge: number;
}

const owner: Owner = { name: "", age: 0 };

const myService: MyService = { ownerAge: owner["hoge"]!.value + owner?.age };

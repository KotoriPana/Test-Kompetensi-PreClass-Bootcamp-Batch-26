const arr = [2, 24, 32, 22, 31, 100, 56, 21, 99, 7, 5, 37, 97, 25, 13, 11];

const sortArray = (arr) => {
  const len = arr.length;
  const swap = (arr, left, right) => ([arr[left], arr[right]] = [arr[right], arr[left]]);

  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr, j, j + 1);
      }
    }
  }

  return arr;
};

console.log(`Array before sort : ${arr} \n`);

sortArray(arr);

const arrOdd = arr.filter(function (number) {
  return number % 2 !== 0;
});

const arrEven = arr.filter(function (number) {
  return number % 2 === 0;
});

console.log(`After sort`);
console.log(`Array : ${arr}`);
console.log(`Odd : ${arrOdd}`);
console.log(`Even : ${arrEven}`);

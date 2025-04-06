# react-native-chart-tools

在react-native中使用图表工具

## Installation

```sh
npm install react-native-chart-tools
```

## Usage

### 基本使用

```js
import { Echarts } from 'react-native-chart-tools';

function MyChart() {
  const option = {
    title: { text: '示例图表' },
    xAxis: { data: ['A', 'B', 'C', 'D', 'E'] },
    yAxis: {},
    series: [{ type: 'bar', data: [5, 20, 36, 10, 10] }],
  };

  return <Echarts option={option} style={{ height: 300 }} />;
}
```

### 示例图表

![示例图表](./example/assets/chart-example.png)

### 配置选项

| 属性          | 类型      | 说明               |
| ------------- | --------- | ------------------ |
| option        | object    | ECharts配置对象    |
| style         | ViewStyle | 容器样式           |
| height        | number    | 图表的高度         |
| onChartsError | function  | 图表加载失败时调用 |

其他参数兼容webview的属性，可自行配置.
https://github.com/react-native-webview/react-native-webview/blob/master/docs/Getting-Started.md

### 兼容性

| 平台    | 支持情况 | 备注                                                                                                                                                                                                  |
| ------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Android | ✅       |
| iOS     | ✅       |
| 鸿蒙    | ✅       | 该组件基于webview实现，使用项目中安装的 react-native-webview,如果要适配鸿蒙,需要自行将react-native-webview鸿蒙化,适配方式参考:https://gitee.com/openharmony-sig/ohos_react_native/tree/master/docs/en |

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)

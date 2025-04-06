import React, { useCallback, useEffect, useRef } from 'react';
import {
  WebView,
  type WebViewMessageEvent,
  type WebViewProps,
} from 'react-native-webview';

interface EchartsProps extends WebViewProps {
  option: Record<string, any>; // Echarts 配置项
  width?: number; // Echarts 宽度
  height: number; // Echarts 高度
  style?: object; // webview 样式
  onChartsError?: (error: string) => void; // 错误回调
}

const Echarts = (props: EchartsProps) => {
  const webViewRef = useRef<WebView>(null);
  const isLoading = useRef<boolean>(false); // 判断脚本是否加载完成
  const option = useRef<Record<string, any>>({}); // 保存上一次的配置项

  const loadEcharts = useCallback(() => {
    if (webViewRef.current) {
      const injectedScript = `
        window.OptionUpdate = new CustomEvent('OptionUpdate', {
          detail: {
              option: ${JSON.stringify(props?.option)},
          },
        });
        window.dispatchEvent(window.OptionUpdate);
      `;
      webViewRef.current.injectJavaScript(injectedScript);
    }
  }, [props?.option]);

  useEffect(() => {
    if (JSON.stringify(props?.option) !== JSON.stringify(option.current)) {
      option.current = props?.option || {};
    }
    if (isLoading.current) {
      loadEcharts();
    }
  }, [loadEcharts, props?.option]);

  useEffect(() => {
    return () => {
      // 组件卸载时执行清理
      webViewRef.current?.stopLoading();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      webViewRef.current?.injectJavaScript('window.location = "about:blank"');
    };
  }, []);

  const handleOnMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.code === 1) {
        isLoading.current = true;
        loadEcharts();
      } else if (data.code === 0) {
        props?.onChartsError?.('脚本加载失败');
      }
    } catch (error) {
      props?.onChartsError?.('消息解析失败');
    }
  };

  return (
    <WebView
      ref={webViewRef}
      scrollEnabled={false} // 禁用滚动
      originWhitelist={['*']}
      onError={() => {
        console.error('WebView加载错误');
      }}
      {...props}
      source={require('./template.html')} // 调整路径到你的 HTML 文件
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        flex: 1,
        height: props?.height || '100%',
        width: props?.width || '100%',
        ...(props?.style || {}),
      }}
      onMessage={handleOnMessage}
    />
  );
};

export default React.memo(Echarts);

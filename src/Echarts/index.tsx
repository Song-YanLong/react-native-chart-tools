import React, { useCallback, useEffect, useRef } from 'react';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

const Echarts = (props: any) => {
  const webViewRef = useRef<WebView>(null);
  const isLoading = useRef<boolean>(false); // 判断脚本是否加载完成
  const option = useRef<Record<string, any>>({}); // 保存上一次的配置项

  const loadEcharts = useCallback(() => {
    if (webViewRef.current) {
      const injectedScript = `
        window.OptionUpdate = new CustomEvent('OptionUpdate', {
          detail: {
              option: ${JSON.stringify(props?.option)},
              width: ${props?.width},
              height: ${props?.height},
          },
        });
        window.dispatchEvent(window.OptionUpdate);
      `;
      webViewRef.current.injectJavaScript(injectedScript);
    }
  }, [props?.option, props?.width, props?.height]);

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
    console.log('event', event.nativeEvent.data);
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.code === 1) {
        isLoading.current = true;
        loadEcharts();
      } else if (data.code === 0) {
        console.error('脚本加载失败');
      }
    } catch (error) {
      console.error('消息解析失败:', error);
    }
  };

  return (
    <WebView
      ref={webViewRef}
      scrollEnabled={false} // 禁用滚动
      originWhitelist={['*']}
      source={require('./template.html')} // 调整路径到你的 HTML 文件
      // eslint-disable-next-line react-native/no-inline-styles
      style={{ flex: 1 }}
      onMessage={handleOnMessage}
      onError={() => {
        console.error('WebView加载错误');
      }}
    />
  );
};

export default React.memo(Echarts);

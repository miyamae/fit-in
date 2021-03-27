import Head from 'next/head';
import { Container, CssBaseline, ThemeProvider, colors, createMuiTheme } from '@material-ui/core';

export default function Layout({ children }) {
  const theme = createMuiTheme({
    palette: {
      primary: {
        main: colors.blue[800],
      },
      type: 'dark',
    },
  });

  return (
    <>
      <Head>
        <title>画像切り取り＆リサイズツール [ fit-in ]</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <main>
          <Container maxWidth="lg">{children}</Container>
        </main>
      </ThemeProvider>
    </>
  );
}

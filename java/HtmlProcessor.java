import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;

public class HtmlProcessor {
    public static void main(String[] args) {
        if (args.length < 1) {
            System.err.println("URLが指定されていません");
            return;
        }
        String urlString = args[0];
        try {
            URL url = new URL(urlString);
            Scanner scanner = new Scanner(url.openStream(), StandardCharsets.UTF_8);
            StringBuilder sb = new StringBuilder();
            while (scanner.hasNextLine()) {
                sb.append(scanner.nextLine()).append("\n");
            }
            scanner.close();
            String html = sb.toString();

            // href/srcを書き換え（簡易）
            html = html.replaceAll("(href|src)=\"(.*?)\"", "$1=\"/api/proxy?url=$2\"");
            System.out.println(html);

        } catch (Exception e) {
            System.err.println("HTML取得/書き換え失敗: " + e.getMessage());
        }
    }
}

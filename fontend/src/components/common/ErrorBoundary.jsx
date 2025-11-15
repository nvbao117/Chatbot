import { Component } from "react"

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.error("Chat ErrorBoundary caught: ", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "2rem", color: "#dc2626" }}>
          <h2 style={{ marginTop: 0 }}>Đã xảy ra lỗi khi tải trang chat</h2>
          <p>Vui lòng tải lại trang hoặc thử lại sau.</p>
          <pre style={{ whiteSpace: "pre-wrap", background: "#fff1f2", padding: "1rem", borderRadius: 8 }}>
            {String(this.state.error)}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary




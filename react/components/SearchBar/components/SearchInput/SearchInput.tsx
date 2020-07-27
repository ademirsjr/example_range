import * as React from 'react';
import stylesCss from './styles.css';
import { searchBarValues } from '../../values';
import { IconArrowBack, IconClose, IconSearch } from 'vtex.store-icons';

interface SearchInputProps {
  currentQuery: string;
  placeholder: string;
  handleKeyUp: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  handleCloseClick: (event: React.MouseEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

interface SearchInputState {
  emptySearchWasTried: boolean;
  isFocused: boolean;
}

export class SearchInput extends React.Component<
  SearchInputProps,
  SearchInputState
> {
  public readonly state = {
    emptySearchWasTried: false,
    isFocused: false,
  };

  currentWidth: number;
  currentPosition: number;
  inputRef: React.RefObject<any>;
  bindedResize: () => void;

  constructor(props: SearchInputProps) {
    super(props);

    this.inputRef = React.createRef();
    this.currentWidth = 0;
    this.currentPosition = 0;
    this.bindedResize = this.onResize.bind(this);
  }

  componentDidMount() {
    this.currentWidth = this.inputRef.current.offsetWidth;
    this.currentPosition = this.inputRef.current.offsetTop;

    this.addListeners();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.bindedResize, false);
  }

  onResize() {
    if (this.currentWidth !== this.inputRef.current.offsetWidth)
      this.currentWidth = this.inputRef.current.offsetWidth;
  }

  addListeners() {
    window.addEventListener('resize', this.bindedResize, false);
    // document.addEventListener('click', this.handleDocumentClick.bind(this));
  }

  handleFocus() {
    this.currentWidth = this.inputRef.current.offsetWidth;
  }

  onSubmitWrapper(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (this.props.currentQuery.length === 0) {
      this.setState({
        emptySearchWasTried: true,
      });

      setTimeout(() => this.setState({ emptySearchWasTried: false }), 4000);
    } else {
      this.setState({
        emptySearchWasTried: false,
      });

      this.props.onSubmit(event);
    }
  }

  onClickClose(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    this.inputRef.current.value = '';

    this.setState({
      emptySearchWasTried: true,
    });
  }

  handleClose(event: React.MouseEvent<HTMLInputElement, MouseEvent>) {
    this.inputRef.current.value = '';

    this.props.handleCloseClick(event);
  }

  render() {
    const inputClass = `${stylesCss.searchInputInput} ${searchBarValues.inputClass}`;

    return (
      <div className={stylesCss.searchInput}>
        <form
          className={stylesCss.searchForm}
          method="get"
          action="/search"
          onSubmit={this.onSubmitWrapper.bind(this)}
        >
          <span
            id="btnCloseSearchBar"
            className={`${stylesCss.searchInputBack} ${stylesCss.searchInputBackWrapper}`}
          >
            <IconArrowBack size={18} />
          </span>
          <input
            ref={this.inputRef}
            className={`${inputClass} ${
              this.state.emptySearchWasTried ? stylesCss.searchInputError : ''
            }`}
            onKeyUp={this.props.handleKeyUp}
            placeholder={
              this.state.emptySearchWasTried
                ? 'Busque por marca, modelo...'
                : this.props.placeholder
            }
            onFocus={this.handleFocus.bind(this)}
            name="query"
            autoComplete="off"
          />
          <button className={stylesCss.searchInputButton} type="submit">
            <IconSearch size={20} viewBox="0, 0, 21, 21" />
          </button>
          <span
            className={`${stylesCss.searchInputClose} ${stylesCss.searchInputCloseWrapper}`}
            onClick={this.handleClose.bind(this)}
          >
            <IconClose size={25} type="line" />
          </span>
        </form>
      </div>
    );
  }
}
